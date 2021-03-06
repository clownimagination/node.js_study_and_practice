//const marked = require('marked')
const Comment = require('../lib/mysql_connect').Comment
const User = require('../lib/mysql_connect').User

// 将 comment 的 content 从 markdown 转换成 html
// Comment.plugin('contentToHtml', {
//   afterFind: function (comments) {
//     return comments.map(function (comment) {
//       comment.content = marked(comment.content)
//       return comment
//     })
//   }
// })

module.exports = {
  // 创建一个留言
  create: function create (comment) {
    return Comment.create(comment)
  },

  // 通过留言 id 获取一个留言
  getCommentById: function getCommentById (commentId) {
    return Comment.findOne({ id: commentId })
  },

  // 通过留言 id 删除一个留言
  delCommentById: function delCommentById (commentId) {
    return Comment.deleteOne({ id: commentId })
  },

  // 通过文章 id 删除该文章下所有留言      未验证
  delCommentsByPostId: function delCommentsByPostId (postId) {
    return Comment.findAll(postId).then(function (comments){
        comments.array.forEach(comment=> {
            Comment.destroy({
                where: {
                    id: comment.id
                }
            })
        });
    })
  },

  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getComments: function getComments (postId) {
    return Comment.findAll({
        where: {
          articleId: postId
        },
        include: [{
          model: User, // 此处必须为一个 function，不能是一个table名称
          attributes: ['name', 'id'],
      }],
        order: [['createdAt', 'ASC']]
    })
  },

  // 通过文章 id 获取该文章下留言数
  getCommentsCount: function getCommentsCount (postId) {
    return Comment.count({ 
      where: {
        articleId: postId 
      }
      })
  }
}