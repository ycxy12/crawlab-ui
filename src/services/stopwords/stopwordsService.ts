// import axios from 'axios';
import useRequest from '@/services/request1';

const { get, post, put, del } = useRequest();

const useStopwordsService = () => {

  const downloadStopwords = async (params: any) => {
    return await get('/qb-crawlab/common/stopwords/download', params);
  };

  const uploadStopwords = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await post('/qb-crawlab/common/stopwords/upload', { data: formData }, null, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  return {
    downloadStopwords,
    uploadStopwords,
  };
};

export default useStopwordsService;
