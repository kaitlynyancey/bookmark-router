function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: "test bookmark 1",
            websiteurl: "www.one.com",
            rating: 2,
            descr: "test one"
        },
        {
            id: 2,
            title: "test bookmark 2",
            websiteurl: "www.two.com",
            rating: 5,
            descr: "test two"
        },
        {
            id: 3,
            title: "test bookmark 3",
            websiteurl: "www.three.com",
            rating: 4,
            descr: "test three"
        },
        {
            id: 4,
            title: "test bookmark 4",
            websiteurl: "www.four.com",
            rating: 1,
            descr: "test four"
        },
    ];
}

module.exports = {
    makeBookmarksArray,
}