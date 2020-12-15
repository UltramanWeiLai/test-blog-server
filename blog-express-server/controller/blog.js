const xss = require('xss')
const { exec, escape } = require('../db/mysql')

/**
 * 1=1 的作用是为了占一个位置，主要是当 author 和 keyword 都没有值的时候防止 sql 语法有问题
 */
const getList = (author, keyword) => {
    author = author ? escape(author) : author
    keyword = keyword ? escape(`%${keyword}%`) : keyword

    let sql = `select * from blogs where state=1 `
    if(author) sql += `and author=${author} `
    if(keyword) sql += `and title like ${keyword} `
    sql +='order by createtime desc;'
    return exec(sql)
}

const getDetail = (id) => {
    id = escape(id)

    const sql = `select * from blogs where id=${id};`
    return exec(sql).then(rows => rows[0]) 
}

const newBlog = (data = {}) => {
    let { title, content, author } = data
    title = escape(xss(title))
    content = escape(xss(content))
    author = escape(author)
    const createtime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author) 
        values (${title},${content},${createtime},${author});`
    return exec(sql).then(insertData => ({ id: insertData.insertId }))
}

const updateBlog = (id, data = {}) => {
    let { title, content } = data
    id = escape(id)
    title = escape(xss(title))
    content = escape(xss(content))
    const sql = `update blogs set title=${title}, content=${content} where id=${id};`
    return exec(sql).then(updateData => !!(updateData.affectedRows > 0))
}

const deleteBlog = (id, author) => {
    id = escape(id)
    author = escape(author)
    // delete from blogs where id='${id}' and author='${author}'
    const sql = `update blogs set state='0' where id=${id} and author=${author};`
    return exec(sql).then(deleteData => !!(deleteData.affectedRows > 0))
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}
