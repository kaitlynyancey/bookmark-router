const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')
const BookmarksService = require('./bookmarks-service')

const bookmarkRouter = express.Router()

bookmarkRouter.use(express.json())

bookmarkRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks)
            })
            .catch(next)
    })
    .post((req, res) => {
        const { title, url, rating, desc } = req.body
        if (!title) {
            logger.error('Title is required')
            return res
                .status(400)
                .send('Invalid data')
        }
        if (!url) {
            logger.error('URL is required')
            return res
                .status(400)
                .send('Invalid data')
        }
        if (!rating) {
            logger.error('Rating is required')
            return res
                .status(400)
                .send('Invalid data')
        }
        if (rating < 0 || rating > 5) {
            logger.error('Rating must be between 0 and 5')
            return res
                .status(400)
                .send('Invalid data')
        }
        if (isNaN(rating)) {
            logger.error('Rating must be a number')
            return res
                .status(400)
                .send('Invalid data')
        }
        if (!desc) {
            logger.error('Description is required')
            return res
                .status(400)
                .send('Invalid data')
        }
        const id = uuid()

        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        }
        bookmarks.push(bookmark)
        logger.info(`Bookmark with id ${id} created`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark)
    })

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        const { id } = req.params
        const knexInstance = req.app.get('db')
        BookmarksService.getById(knexInstance, id)
            .then(bookmark => {
                if (!bookmark) {
                    return res.status(404).json({
                        error: { message: `Bookmark doesn't exist` }
                    })
                }
                res.json(bookmark)
            })
            .catch(next)
    })

    .delete((req, res) => {
        const { id } = req.params
        const bookmarkIndex = bookmarks.findIndex(bk => bk.id == id)
        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found`)
            return res
                .status(404)
                .send('Bookmark not found')
        }
        bookmarks.splice(bookmarkIndex, 1)
        logger.info(`Card with id ${id} deleted.`)
        res
            .status(204)
            .end()
    })

module.exports = bookmarkRouter