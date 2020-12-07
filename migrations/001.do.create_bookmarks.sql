CREATE TABLE bookmarks ( 
    id INTEGER primary key generated by default as identity, 
    title TEXT NOT NULL, 
    websiteURL TEXT NOT NULL, 
    rating INTEGER DEFAULT 3, 
    descr TEXT );