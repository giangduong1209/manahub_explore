import Icon from '@ant-design/icons';

import { ReactComponent as Delete } from './svgs/deleteIcon.svg';

const DeleteIcon = (props) => {
  return <Icon component={Delete} {...props} />;
};

export default DeleteIcon;
