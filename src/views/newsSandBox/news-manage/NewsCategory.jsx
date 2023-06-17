import React, { useState, useEffect, useContext, useRef } from 'react'
import { Button, Table, Input, Modal, Form } from 'antd'
import request from '../../../request';
const EditableContext = React.createContext(null);
import {
  DeleteOutlined
} from '@ant-design/icons'
const { confirm } = Modal

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])

  const showConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        request.delete(`/categories/${item.id}`)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    request.get('/categories')
      .then(res => {
        setDataSource(res.data)
      })
  }, [])

  const handleSave = (record) => {
    setDataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.title
        }
      }
      return item
    }))

    // 后端修改
    request.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button type="danger" style={{ marginRight: '10px' }}
              onClick={() => showConfirm(item)}
              shape="circle" icon={<DeleteOutlined />} />
          </>
        )
      }
    },
  ];
  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }} rowKey={item => item.id}
        components={components}
      />
    </div>
  )
}
