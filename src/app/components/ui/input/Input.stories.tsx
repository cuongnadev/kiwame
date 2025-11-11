import "@/app/globals.css";

import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Nhập nội dung...',
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

// 🔹 1. Default input
export const Default: Story = {
  args: {
    label: 'Tên người dùng',
  },
};

// 🔹 2. Password input có toggle
export const Password: Story = {
  args: {
    label: 'Mật khẩu',
    type: 'password',
    showPasswordToggle: true,
  },
};

// 🔹 3. Search input
export const SearchInput: Story = {
  args: {
    label: 'Tìm kiếm',
    variant: 'search',
    clearable: true,
  },
};

// 🔹 4. Error input
export const ErrorInput: Story = {
  args: {
    label: 'Error Input',
    clearable: true,
    error: 'error'
  },
};

