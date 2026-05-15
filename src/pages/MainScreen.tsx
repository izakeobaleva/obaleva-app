<code>  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1528] border-t border-white/10 z-50 flex justify-center">
      <div className="w-full max-w-md px-4 py-2">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}
                style={{ minHeight: '52px', minWidth: '60px' }}
              >
                <tab.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[11px] font-medium">{tab.label}</span>
                {isActive && <div className="w-1.5 h-0.5 rounded-full bg-[#F4D03F] mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );</code>