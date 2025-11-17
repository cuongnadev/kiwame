import "@/app/globals.css";

import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import { ArrowRight, Loader2, LogIn, Plus, Settings, Trash2, User } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    text: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    text: 'Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    text: 'Ghost',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    text: 'Delete',
    variant: 'danger',
  },
};

// ⚙️ Size
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button text="Small" size="sm" />
      <Button text="Medium" size="md" />
      <Button text="Large" size="lg" />
    </div>
  ),
};

// 🔘 Radius
export const Radius: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button text="None" radius="none" />
      <Button text="Small" radius="sm" />
      <Button text="Medium" radius="md" />
      <Button text="Large" radius="lg" />
      <Button text="Full" radius="full" />
    </div>
  ),
};

// ⏳ Loading & Disabled
export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button text="Loading..." loading />
      <Button text="Disabled" disabled />
      <Button text="Normal" />
    </div>
  ),
};

// 🔔 Icon
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button text="Add" icon={<Plus />} />
        <Button text="Add Right" icon={<Plus />} iconPosition="right" />
      </div>
      <div className="flex gap-4">
        <Button text="Delete" icon={<Trash2 />} variant="danger" />
        <Button text="Delete" icon={<Trash2 />} iconPosition="right" variant="danger" />
      </div>
    </div>
  ),
};


export const AllVariants: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-10 space-y-10">
      <h1 className="text-2xl font-bold mb-4">🎨 Button Showcase</h1>

      {/* === Variants === */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button text="Primary" variant="primary" />
          <Button text="Secondary" variant="secondary" />
          <Button text="Outline" variant="outline" />
          <Button text="Ghost" variant="ghost" />
          <Button text="Danger" variant="danger" />
        </div>
      </section>

      {/* === Sizes === */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Sizes</h2>
        <div className="flex items-center gap-4">
          <Button text="Small" size="sm" />
          <Button text="Medium" size="md" />
          <Button text="Large" size="lg" />
        </div>
      </section>

      {/* === Radius === */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Radius</h2>
        <div className="flex items-center gap-4">
          <Button text="None" radius="none" />
          <Button text="Small" radius="sm" />
          <Button text="Medium" radius="md" />
          <Button text="Large" radius="lg" />
          <Button text="Full" radius="full" />
        </div>
      </section>

      {/* === Icon Variants === */}
      <section>
        <h2 className="text-xl font-semibold mb-3">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button text="Login" icon={<LogIn size={18} />} iconPosition="left" />
          <Button text="Next" icon={<ArrowRight size={18} />} iconPosition="right" />
          <Button icon={<Settings size={18} />} />
          <Button text="Profile" icon={<User size={18} />} variant="outline" />
          <Button text="Delete" icon={<Trash2 size={18} />} variant="danger" />
        </div>
      </section>

      {/* === Loading & Disabled === */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Loading / Disabled</h2>
        <div className="flex flex-wrap gap-4">
          <Button text="Loading" loading />
          <Button text="Loading Secondary" variant="secondary" loading />
          <Button text="Disabled" disabled />
          <Button text="Disabled Outline" variant="outline" disabled />
          <Button icon={<Loader2 />} loading variant="ghost" />
        </div>
      </section>

      {/* === Combined Examples === */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Combined Styles</h2>
        <div className="flex flex-wrap gap-4">
          <Button text="Sign In" variant="primary" radius="full" />
          <Button text="Continue with Google" icon={<User size={18} />} variant="outline" radius="lg" />
          <Button text="Danger Full" variant="danger" radius="full" />
          <Button text="Minimal" variant="ghost" radius="sm" />
          <Button text="Add Item" icon={<Plus size={18} />} variant="secondary" radius="lg" />
        </div>
      </section>
    </div>
  ),
};
