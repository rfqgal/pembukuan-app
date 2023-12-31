/* eslint-disable import/prefer-default-export */
const translateMonth = (month) => {
  switch (month) {
    case 'January':
      return 'Januari';
    case 'February':
      return 'Februari';
    case 'March':
      return 'Maret';
    case 'April':
      return 'April';
    case 'May':
      return 'Mei';
    case 'June':
      return 'Juni';
    case 'July':
      return 'Juli';
    case 'August':
      return 'Agustus';
    case 'September':
      return 'September';
    case 'October':
      return 'Oktober';
    case 'November':
      return 'November';
    case 'December':
      return 'Desember';

    default:
      return '';
  }
};

export { translateMonth };
