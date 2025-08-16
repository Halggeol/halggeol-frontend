/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';
import { toneMap } from '@nextcss/color-tools';
import forms from '@tailwindcss/forms';

function generateColors(color) {
  return {
    DEFAULT: color,
    ...toneMap(color),
  };
}

export default {
  content: ['index.html', 'src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { raw: '(min-width: 768px) and (max-width: 1280px)' },
      wide: { min: '1536px' },
    },
    fontFamily: {
      sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      // title
      'title-xl': ['54px', { lineHeight: '65px', letterSpacing: '-0.3px' }],
      'title-lg': ['32px', { lineHeight: '39px', letterSpacing: '-0.2px' }],
      'title-md': ['28px', { lineHeight: '34px', letterSpacing: '-0.2px' }],
      'title-sm': ['22px', { lineHeight: '28px', letterSpacing: '-0.2px' }],

      // body
      body01: ['21px', { lineHeight: '32px', letterSpacing: '0px' }],
      body02: ['17px', { lineHeight: '22px', letterSpacing: '0px' }],

      // etc
      callout: ['16px', { lineHeight: '21px', letterSpacing: '-0.1px' }],
      footnote: ['14px', { lineHeight: '18px', letterSpacing: '-0.1px' }],
      caption: ['12px', { lineHeight: '16px', letterSpacing: '-0.1px' }],
    },
    extend: {
      colors: {
        // 주요 컬러 - 일단 스켈레톤 사용 색으로 지정. gray 영역은 tailwind 기본 색상 사용
        primary: {
          ...generateColors('#FFD338'), // #FF5858(빨간 계열로 가면), #FFD338(국민은행)
        },
        secondary: {
          ...generateColors('#FFBC00'), // #383838(빨간 계열로 가면), #FFBC00(국민은행)
        },
        'gray-primary': {
          ...generateColors('#60584C'), // 국민은행
        },
        'gray-secondary': {
          ...generateColors('#918274'), // 국민은행
        },
        // 폰트 컬러
        'fg-primary': {
          ...generateColors('#26282c'),
        },
        'fg-secondary': {
          ...generateColors('#696E76'),
        },
        'fg-gray': {
          ...generateColors('#C6CBD0'),
        },
        // 기본 상태
        'status-blue': { ...generateColors('#287EFF') },
        'status-red': { ...generateColors('#F23F3F') },
        // 상품별 색상
        savings: '#FFF4DF',
        'fg-savings': '#F95A00',
        deposit: '#FFEFEE',
        'fg-deposit': '#FB0000',
        forex: '#F9EFE3',
        'fg-forex': '#995C14',
        fund: '#ECF0FF',
        'fg-fund': '#1544BC',
        cash: '#6CD18C',
        'fg-cash': '#11A740',
        pension: '#F9EFFA',
        'fg-pension': '#CC0CCC',
      },
      boxShadow: {
        card: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      },
      borderWidth: {
        '1/2': '0.5px',
      },
    },
  },
  plugins: [daisyui, forms],
};
