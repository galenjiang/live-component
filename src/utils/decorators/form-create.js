import { Form } from 'antd';

export default options => Component => Form.create(options || {})(Component);
