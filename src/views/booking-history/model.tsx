import { ColumnsType } from "antd/es/table";
import { BookingSearchResult } from "./BookingHistory";
import dayjs from 'dayjs';
import Popconfirm from "antd/es/popconfirm";

export function getColumns(operate: {
  changeStatus: (arg0: number) => void
} = {
    changeStatus: () => { }
  }): ColumnsType<BookingSearchResult> {
  return [
    {
      title: '会议室名称',
      dataIndex: 'room',
      render(_, record) {
        return record.room.name
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render(_, record) {
        return dayjs(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render(_, record) {
        return dayjs(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      onFilter: (value, record) => record.status.startsWith(value as string),
      filters: [
        {
          text: '审批通过',
          value: '审批通过',
        },
        {
          text: '审批驳回',
          value: '审批驳回',
        },
        {
          text: '申请中',
          value: '申请中',
        },
        {
          text: '已解除',
          value: '已解除'
        },
      ],
    },
    {
      title: '预定时间',
      dataIndex: 'createTime',
      render(_, record) {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    {
      title: '备注',
      dataIndex: 'note'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '操作',
      render: (_, record) => (
        record.status === '申请中' ? <div>
          <Popconfirm
            title="解除申请"
            description="确认解除吗？"
            onConfirm={() => operate.changeStatus?.(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">解除预定</a>
          </Popconfirm>
        </div> : null
      )
    }
  ];
}