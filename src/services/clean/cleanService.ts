import useRequest from '@/services/request1';

const { get, post, put, del } = useRequest();

const useCleanService = () => {
  //采集文章列表
  const listSubjectArticle = async (params: any) => {
    return await get('/qb-crawlab/subjectArticle/list', params);
  };
  //添加采集文章
  const addSubjectArticle = async (params: any) => {
    return await post('/qb-crawlab/subjectArticle', params);
  };
  //编辑采集文章
  const editSubjectArticle = async (params: any) => {
    return await put('/qb-crawlab/subjectArticle', params);
  };
  //删除采集文章
  const deleteSubjectArticle = async (id: string) => {
    return await del(`/qb-crawlab/subjectArticle/${id}`);
  };
  //获取采集文章详情
  const getSubjectArticle = async (id: string) => {
    return await get(`/qb-crawlab/subjectArticle/${id}`);
  };

  return {
    listSubjectArticle,
    addSubjectArticle,
    editSubjectArticle,
    deleteSubjectArticle,
    getSubjectArticle
  };
};

export default useCleanService;
