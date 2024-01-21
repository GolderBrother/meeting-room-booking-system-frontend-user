import { Button, DatePicker, Form, Input, Table, TimePicker, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import './booking-history.css';
import { MeetingRoomSearchResult } from "../meeting-room-list/MeetingRoomList";
import { bookingList, unbind } from "../../api/booking-history";
import { getColumns } from "./model";

export interface SearchBooking {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
}
export interface BookingSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  room: MeetingRoomSearchResult;
}

export function BookingHistory() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [bookingSearchResult, setBookingSearchResult] = useState<Array<BookingSearchResult>>([]);
  const [num, setNum] = useState(0);

  const searchBooking = useCallback(async (values: SearchBooking) => {
    const res = await bookingList(values, pageNo, pageSize);

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setBookingSearchResult(data.bookings.map((item: BookingSearchResult) => {
        return {
          key: item.id,
          ...item
        }
      }))
    } else {
      message.error(data || '系统繁忙，请稍后再试');
    }
  }, [pageNo, pageSize]);


  const [form] = useForm();
  function getUserInfo() {
    const userInfoStr = localStorage.getItem('user_info') || '{}';

    if (userInfoStr) {
      return JSON.parse(userInfoStr);
    }
  }
  useEffect(() => {
    searchBooking({
      username: getUserInfo().username ?? '',
      meetingRoomName: form.getFieldValue('meetingRoomName'),
      meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
      rangeStartDate: form.getFieldValue('rangeStartDate'),
      rangeStartTime: form.getFieldValue('rangeStartTime'),
      rangeEndDate: form.getFieldValue('rangeEndDate'),
      rangeEndTime: form.getFieldValue('rangeEndTime')
    });
  }, [form, searchBooking, num]);

  const changePage = function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }

  async function changeStatus(id: number) {

    const res = await unbind(id);

    if (res.status === 201 || res.status === 200) {
      message.success('状态更新成功');
      setNum(Math.random());
    } else {
      message.error(res.data.data);
    }
  }

  const columns = getColumns({
    changeStatus
  })


  return <div id="bookingHistory-container">
    <div className="bookingHistory-form">
      <Form
        form={form}
        onFinish={searchBooking}
        name="search"
        layout='inline'
        colon={false}
      >
        <Form.Item label="会议室名称" name="meetingRoomName">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="预定开始日期" name="rangeStartDate">
          <DatePicker placeholder="请选择" />
        </Form.Item>

        <Form.Item label="预定开始时间" name="rangeStartTime">
          <TimePicker placeholder="请选择" />
        </Form.Item>

        <Form.Item label="预定结束日期" name="rangeEndDate">
          <DatePicker placeholder="请选择" />
        </Form.Item>

        <Form.Item label="预定结束时间" name="rangeEndTime">
          <TimePicker placeholder="请选择" />
        </Form.Item>

        <Form.Item label="位置" name="meetingRoomPosition">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            搜索预定历史
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className="bookingHistory-table">
      <Table columns={columns} dataSource={bookingSearchResult} pagination={{
        current: pageNo,
        pageSize: pageSize,
        onChange: changePage
      }} />
    </div>
  </div>
}
