import request from '@/utils/request'

const api_name = '/admin/product'

export default ({
  //获取1级分类列表
  getCategorys1 () {
    return request({
      method: 'GET',
      url: `${api_name}/getCategory1`
    })
  },
  //获取2级分类列表
  getCategorys2 (category1Id) {
    return request({
      method: 'GET',
      url: `${api_name}/getCategory2/${category1Id}`
    })
  },
  //获取3级分类列表
  getCategorys3 (category2Id) {
    return request({
      method: 'GET',
      url: `${api_name}/getCategory3/${category2Id}`
    })
  },
  //获取属性列表/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getAttrList ({ category1Id, category2Id, category3Id }) {
    return request({
      method: 'GET',
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    })
  },
  //删除属性
  deleteAttr (attrId) {
    return request({
      method: 'DELETE',
      url: `${api_name}/deleteAttr/${attrId}`
    })
  },
  //获取属性值列表GET /admin/product/getAttrValueList/{attrId}
  getAttrValueList (attrId) {
    return request({
      method: 'GET',
      url: `${api_name}/getAttrValueList/${attrId}`
    })
  },
  //保存属性/admin/product/saveAttrInfo
  saveAttrInfo (attr) {
    return request({
      method: 'POST',
      url: `${api_name}/saveAttrInfo`,
      data: attr
    })
  }
})
