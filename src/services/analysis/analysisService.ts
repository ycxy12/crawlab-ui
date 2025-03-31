import useRequest from '@/services/request1';

const { get, post, put, del } = useRequest();

const useAnalysisService = () => {
  //数据分析列表
  const listWiki = async (params: any) => {
    return await get('/qb-crawlab/wiki/list', params);
  };
  //删除分析结果
  const deleteWiki = async (id: string) => {
    return await del(`/qb-crawlab/wiki/${id}`);
  };
  //数据分析详情
  const getWiki = async (id: string) => {
    return await get(`/qb-crawlab/wiki/${id}`);
  };

  return {
    listWiki,
    deleteWiki,
    getWiki
  };
};

export default useAnalysisService;
