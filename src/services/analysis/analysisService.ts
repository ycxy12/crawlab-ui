import useRequest from '@/services/request1';

const { get, post, put, del } = useRequest();

const useAnalysisService = () => {
  //数据分析列表
  const listAnalysisResult = async (params: any) => {
    return await get('/qb-crawlab/analysisResult/list', params);
  };
  //分析情报
  const analysisResult = async (params: any) => {
    return await post('/qb-crawlab/analysisResult/analysisResult', params);
  };
  //分析情报
  const analyzeResult = async (params: any) => {
    return await post('/qb-crawlab/intelligence/analyze', params);
  };
  //删除分析结果
  const deleteAnalysisResult = async (id: string) => {
    return await del(`/qb-crawlab/analysisResult/${id}`);
  };
  //数据分析详情
  const getAnalysisResult = async (id: string) => {
    return await get(`/qb-crawlab/analysisResult/${id}`);
  };

  return {
    listAnalysisResult,
    analysisResult,
    analyzeResult,
    deleteAnalysisResult,
    getAnalysisResult
  };
};

export default useAnalysisService;
