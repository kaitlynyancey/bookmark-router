const express = require('express')
const xss = require('xss')
const { isWebUri } = require('valid-url')
const logger = require('../logger')
const BookmarksService = require('./bookmarks-service')

const bookmarkRouter = express.Router()
const jsonParser = express.json()

const formatBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    websiteurl: bookmark.websiteurl,
    rating: Number(bookmark.rating),
    descr: xss(bookmark.descr)
})

bookmarkRouter.use(express.json())

bookmarkRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks.map(bookmark => formatBookmark(bookmark)))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, websiteurl, rating, descr } = req.body

        if (rating < 0 || rating > 5 || isNaN(rating)) {
            logger.error('Rating must be between 0 and 5')
            return res
                .status(400)
                .send('Invalid data')
        }
        // if (!isWebUri(websiteurl)){
        //     logger.error(`Invalid url`)
        //     return res
        //         .status(400)
        //         .send('Invalid data')
        // }

        const newBookmark = {
            title,
            websiteurl,
            rating,
            descr
        }

        for (const [key, value] of Object.entries(newBookmark)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(formatBookmark(bookmark))
            })
            .catch(next)
    })

bookmarkRouter
    .route('/bookmarks/:id')
    .all((req, res, next) => {
        BookmarksService.getById(
            req.app.get('db'),
            req.params.id
        )
        .then(bookmark => {
            if (!bookmark) {
                return res.status(404).json({
                    error: { message: `Bookmark doesn't exist` }
                })
            }
            res.bookmark = bookmark
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(formatBookmark(bookmark))
    })

    .delete((req, res, next) => {
        const { id } = req.params
        const knexInstance = req.app.get('db')
        BookmarksService.deleteBookmark(knexInstance, id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = bookmarkRouter