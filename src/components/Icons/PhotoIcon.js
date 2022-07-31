import Icon from '@ant-design/icons';

import { ReactComponent as Photo } from './svgs/photo.svg';

const PhotoIcon = (props) => {
  return <Icon component={Photo} {...props} />;
};

export default PhotoIcon;
