/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Button, Form, Input, Popconfirm, Table, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import './meeting-room-list.css';
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { CreateBookingModal } from "./CreateBookingModal";

export interface SearchMeetingRoom {
  name: string;
  capacity: number;
  equipment: string;
}

export interface MeetingRoomSearchResult {
  id: number,
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}

export function MeetingRoomList() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [currentMeetingRoom, setCurrentMeetingRoom] = useState<MeetingRoomSearchResult>();
  const [meetingRoomResult, setMeetingRoomResult] = useState<Array<MeetingRoomSearchResult>>([]);

  const columns: ColumnsType<MeetingRoomSearchResult> = useMemo(() => [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
    },
    {
      title: '位置',
      dataIndex: 'location'
    },
    {
      title: '设备',
      dataIndex: 'equipment'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime'
    },
    {
      title: '上次更新时间',
      dataIndex: 'updateTime'
    },
    {
      title: '预定状态',
      dataIndex: 'isBooked',
      render: (_, record) => (
        record.isBooked ? <Badge status="error">已被预订</Badge> : <Badge status="success">可预定</Badge>
      )
    },
    {
      title: '操作',
      render: (_, record) => (
        <div>
          <a href="#" onClick={() => {
            setIsCreateModalOpen(true);
            setCurrentMeetingRoom(record);
          }}>预定</a>
        </div>
      )
    }
  ], []);
  const mockData: MeetingRoomSearchResult[] = [
    {
      id: 1,
      name: '会议室1',
      capacity: 10,
      location: '楼层1',
      equipment: '投影仪',
      description: '这是一个演示会议室',
      createTime: dayjs('2022-01-01').toDate(),
      updateTime: dayjs('2022-01-02').toDate(),
      isBooked: false,
    },
    {
      id: 1,
      name: '会议室2',
      capacity: 8,
      location: '楼层2',
      equipment: '白板',
      description: '这是另一个演示会议室',
      createTime: dayjs('2022-01-03').toDate(),
      updateTime: dayjs('2022-01-04').toDate(),
      isBooked: true,
    },
    // 添加更多的 mock 数据...
  ];
  
  const searchMeetingRoom = useCallback(async (values: SearchMeetingRoom) => {
    setMeetingRoomResult(mockData);
    // const res = await searchMeetingRoomList(values.name, values.capacity, values.equipment, pageNo, pageSize);

    // const { data } = res.data;
    // if (res.status === 201 || res.status === 200) {
    //   setMeetingRoomResult(data.meetingRooms.map((item: MeetingRoomSearchResult) => {
    //     return {
    //       key: item.id,
    //       ...item
    //     }
    //   }))
    // } else {
    //   message.error(data || '系统繁忙，请稍后再试');
    // }
  }, []);

  const [form] = useForm();

  useEffect(() => {
    searchMeetingRoom({
      name: form.getFieldValue('name'),
      capacity: form.getFieldValue('capacity'),
      equipment: form.getFieldValue('equipment')
    });
  }, [pageNo, pageSize]);

  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return <div id="meeting-room-list-container">
    <div className="meetingRoomList-form">
      <Form
        form={form}
        onFinish={searchMeetingRoom}
        name="search"
        layout='inline'
        colon={false}
      >
        <Form.Item label="会议室名称" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="容纳人数" name="capacity">
          <Input />
        </Form.Item>

        <Form.Item label="设备" name="equipment">
          <Input />
        </Form.Item>

        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            搜索会议室
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className="meetingRoomList-table">
      <Table columns={columns} dataSource={meetingRoomResult} pagination={{
        current: pageNo,
        pageSize: pageSize,
        onChange: changePage
      }} />
    </div>
    {
      currentMeetingRoom ?
        <CreateBookingModal meetingRoom={currentMeetingRoom} isOpen={isCreateModalOpen} handleClose={() => {
          setIsCreateModalOpen(false);
        }}></CreateBookingModal>
        : null
    }
  </div>
}
