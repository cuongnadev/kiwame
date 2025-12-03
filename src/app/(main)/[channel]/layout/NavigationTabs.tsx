import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavigationTabsProps {
    activeTab: string,
    setActiveTab: (tab: string) => void,
    type: string,
    channel: string
}

const MainTabs = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'playlists', label: 'Danh sách phát'},
    { id: 'posts', label: 'Bài đăng' },
];

const PostTabs = [
    { id: 'posted', label: 'Đã đăng'},
    { id: 'scheduled', label: 'Đã lên lịch' },
    { id: 'saved', label: 'Đã lưu trữ' }
]

export default function NavigationTabs({ activeTab, setActiveTab, type, channel }: NavigationTabsProps) {
    const tabs = type === 'main' ? MainTabs : PostTabs;
    const router = useRouter();

    const handlePostTabClick = (tabId: string) => {
        setActiveTab(tabId);
        router.push(
            `/${channel}/posts?type=${tabId}`,
            {scroll: false }
        );
    }

    return (
        <div className="flex items-center gap-6">
            {tabs.map((tab) => (
                type === "main" ? (
                    <Link
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(activeTab = tab.id)
                        }}
                        href={`/${channel}/${tab.id === 'home' ? '' : tab.id}`}
                        className={`text-white hover:border-b-2 hover:border-white/90 px-0 py-3 font-semibold
                        ${activeTab === tab.id ? 'border-b-2 border-white text-white' : 'opacity-80'}`}
                        title={tab.label}
                    >
                        {tab.label}
                    </Link>
                ) : (
                    <span
                        key={tab.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handlePostTabClick(tab.id)}
                        className={`text-white hover:border-b-2 hover:border-white/90 px-0 py-3 font-semibold cursor-pointer
                        ${activeTab === tab.id ? 'border-b-2 border-white text-white' : 'opacity-80'}`}
                        title={tab.label}
                    >
                        {tab.label}
                    </span>

                )
            ))}
        </div>
    )
}

