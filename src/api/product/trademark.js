import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default ({
  //品牌分页列表
  getPageList (page, limit) {
    return request({
      method: 'GET',
      url: `${api_name}/${page}/${limit}`,
    })
  },
  //新增品牌
  addTrademark (data) {
    return request({
      method: 'POST',
      url: `${api_name}/save`,
      data
    })
  },
  //修改
  updateTrademark (data) {
    return request({
      method: 'PUT',
      url: `${api_name}/update`,
      data
    })
  },
  //删除
  deleteTrademark (id) {
    return request({
      method: 'DELETE',
      url: `${api_name}/remove/${id}`
    })
  }
})
