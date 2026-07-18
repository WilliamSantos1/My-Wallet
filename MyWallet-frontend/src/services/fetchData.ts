import { api } from "./api";

interface Data {
  endpoint: string;
  params: any;
  setData: (data: any) => void;
}

export default async function fetchData(data: Data[]) {
  for (const obj of data) {
    try {
      const res = await api.get(obj.endpoint, { params: obj.params });
      console.log(res.data);
      obj.setData(res.data);
    } catch (error) {
      console.error(error);
    }
  }
}