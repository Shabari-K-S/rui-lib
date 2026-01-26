import { useEffect, useRef } from 'react';

interface MaskedTextProps {
    children: string;
    className?: string;
    /** Duration of the animation in seconds (default: 0.5) */
    duration?: number;
    /** Delay between each letter in seconds (default: 0.05) */
    staggerDelay?: number;
    /** Color on hover (default: #c6c885) */
    hoverColor?: string;
    /** Easing function (default: ease-in-out) */
    easing?: string;
    onClick?: () => void;
}

const MaskedText = ({
    children,
    className = '',
    duration = 0.5,
    staggerDelay = 0.05,
    hoverColor = '#c6c885',
    easing = 'ease-in-out',
    onClick
}: MaskedTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const letters = Array.from(children);
        const wrappedLetters = letters
            .map((letter) =>
                `<span class="letter">
                    <span class="top">${letter === ' ' ? '&nbsp;' : letter}</span>
                    <span class="bottom">${letter === ' ' ? '&nbsp;' : letter}</span>
                </span>`
            )
            .join('');

        containerRef.current.innerHTML = wrappedLetters;

        const letterElements = containerRef.current.querySelectorAll('.letter');
        letterElements.forEach((el, index) => {
            (el as HTMLElement).style.transitionDelay = `${index * staggerDelay}s`;
        });
    }, [children, staggerDelay]);

    return (
        <>
            <div
                ref={containerRef}
                onClick={onClick}
                className={`inline-block overflow-hidden text-container ${className}`}
                style={{
                    ['--duration' as string]: `${duration}s`,
                    ['--hover-color' as string]: hoverColor,
                    ['--easing' as string]: easing,
                }}
            />
            <style>{`
                .text-container {
                    display: inline-block;
                    overflow: hidden;
                }

                .letter {
                    display: inline-block;
                    position: relative;
                    transition: transform var(--duration) var(--easing), color 0.2s var(--easing);
                    transform: translateY(var(--y, 0));
                }

                .text-container:hover .letter {
                    --y: -100%;
                    color: var(--hover-color);
                }

                .letter .top,
                .letter .bottom {
                    display: inline-block;
                }

                .letter .bottom {
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: translateY(100%);
                }
            `}</style>
        </>
    );
};

export default MaskedText;