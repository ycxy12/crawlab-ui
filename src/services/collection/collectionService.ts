import useRequest from '@/services/request1';

const { get, post, put, del } = useRequest();

const useCollectionService = () => {
  //采集文章列表
  const listCollectionResult = async (params: any) => {
    return await get('/qb-crawlab/collectionResult/list', params);
  };
  //添加采集文章
  const addCollectionResult = async (params: any) => {
    return await post('/qb-crawlab/collectionResult', params);
  };
  //编辑采集文章
  const editCollectionResult = async (params: any) => {
    return await put('/qb-crawlab/collectionResult', params);
  };
  //删除采集文章
  const deleteCollectionResult = async (id: string) => {
    return await del(`/qb-crawlab/collectionResult/${id}`);
  };
  //获取采集文章详情
  const getCollectionResult = async (id: string) => {
    return await get(`/qb-crawlab/collectionResult/${id}`);
  };
  //处理采集结果
  const handleCollectionResult = async (params: any) => {
    return await post('/qb-crawlab/collectionResult/handleResult', params);
  };
  //获取词频
  const getWordFrequency = async (id: any) => {
    return await get(`/qb-crawlab/collectionResult/getWordFrequency/${id}`);
  };

  return {
    listCollectionResult,
    addCollectionResult,
    editCollectionResult,
    deleteCollectionResult,
    getCollectionResult,
    handleCollectionResult,
    getWordFrequency
  };
};

export default useCollectionService;
