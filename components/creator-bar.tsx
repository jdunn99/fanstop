import React from 'react';

const keys = ['Featured', 'Pasta', 'Chicken', 'Lasagna'];

export function CreatorBar() {
    const [active, setActive] = React.useState<string>('Featured');

    return (
        <div className="m-auto block bg-rose-50 px-2 relative flex-1 rounded-full space-x-2 py-1">
            {keys.map((key) => (
                <div
                    key={key}
                    onClick={() => setActive(key)}
                    className={`inline-block cursor-pointer rounded-full hover:bg-white hover:text-rose-500  transition-colors ${
                        active === key ? 'bg-white text-rose-500' : ''
                    } px-2`}
                >
                    <span className="text-sm font-semibold">{key}</span>
                </div>
            ))}
        </div>
    );
}
