import { notification } from 'antd';

function renderNotification(response) {
  if (response.success) {
    notification.success({
      message: 'Sukses',
      description: response.message,
      placement: 'bottomRight',
    });
  } else {
    notification.error({
      message: 'Gagal',
      description: response.message,
      placement: 'bottomRight',
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { renderNotification };
