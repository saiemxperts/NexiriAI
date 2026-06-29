type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({
  isOpen,
}: SidebarProps) {
  return (
    <aside
      className={`
        overflow-hidden
        border-l
        bg-white
        shadow-lg
        transition-all
        duration-300
        ${
          isOpen
            ? "w-80"
            : "w-0"
        }
      `}
    >
      <div className="w-80 h-full p-5">
        Sidebar Content
      </div>
    </aside>
  );
}