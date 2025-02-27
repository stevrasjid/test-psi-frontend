import { Space, Table, Input, Button } from "antd";
import type { GetProps, TableProps } from "antd";
import "./App.css";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  email: string;
  phone1: string;
  phone2: string;
  pictures: string[];
}

interface PaginationType {
  page: number;
  pageSize: number;
  search: string;
}

interface DataList {
  datas: DataType[];
  datasFilter: DataType[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Nama",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Umur",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Alamat",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "No Telepon 1",
    dataIndex: "phone1",
    key: "phone1",
  },
  {
    title: "No Telepon 2",
    dataIndex: "phone2",
    key: "phone2",
  },
  {
    title: "Gambar",
    dataIndex: "pictures",
    render: (_, { pictures }) => (
      <>
        <img
          alt={pictures ? (pictures[2] ? pictures[2] : "") : ""}
          src={pictures ? (pictures[2] ? pictures[2] : "") : ""}
        />
      </>
    ),
  },
];

export default function App() {
  const [datas, setDatas] = useState<DataList>({
    datas: [],
    datasFilter: [],
  });
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const getDatas = async (
    page: number,
    pageSize: number,
    search: string
  ): Promise<void> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("result", pageSize.toString());
      if (search !== undefined) queryParams.append("search", search);
      const url = "http://localhost:8080/api/number4?" + queryParams.toString();
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setDatas({
          datas: response.data.data,
          datasFilter: response.data.data,
        });
        setPagination({
          ...pagination,
          page: page,
          pageSize: pageSize,
        });
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response.data.message;
      alert(message);
    }
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    let newDatas = datas.datas;
    const search = value;
    newDatas = value
      ? newDatas.filter((item: any) => {
          return Object.values(item).some((value) =>
            String(value).toUpperCase().includes(search.toUpperCase())
          );
        })
      : newDatas;

    setDatas({
      ...datas,
      datasFilter: newDatas,
    });
  };

  useEffect(() => {
    getDatas(pagination.page, pagination.pageSize, pagination.search);
  }, [pagination.search]);

  const handleTableChange = (paginationAntdTable: any): void => {
    getDatas(
      paginationAntdTable.current,
      paginationAntdTable.pageSize,
      pagination.search
    );
  };
  return (
    <Space direction="vertical">
      <h2 className="text-start">List</h2>
      <div className="text-start d-flex">
        <Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
          style={{ width: "50%" }}
        />
        <div style={{ width: "50%", textAlign: "right" }}>
          <Button
            icon={<PlusOutlined />}
            style={{ paddingTop: "20px", paddingBottom: "20px" }}
          >
            New Data
          </Button>
        </div>
      </div>
      <Table<DataType>
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
        dataSource={datas.datasFilter}
      />
    </Space>
  );
}
