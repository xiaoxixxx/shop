import request from '@/config/axios'

export interface  FaqVO {
  id: number
  answer: string
  question: string
}

// 查询文章管理列表
export const getQuestionsPage = async (params: any) => {
  return await request.get({ url: `/system/question/list`, params })
}

// 查询文章管理详情
export const getQuestions = async (id: number) => {
  return await request.get({ url: `/system/question/get?id=` + id })
}

// 新增文章管理
export const createQuestions = async (data: FaqVO) => {
  return await request.post({ url: `/system/question/add`, data })
}

// 修改文章管理
export const updateQuestions = async (data: FaqVO) => {
  return await request.post({ url: `/system/question/update`, data })
}

// 删除文章管理
export const deleteQuestions = async (id: number) => {
  return await request.get({ url: `/system/question/del?id=` + id })
}
