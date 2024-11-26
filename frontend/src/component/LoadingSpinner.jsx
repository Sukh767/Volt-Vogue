const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900">
			<div className="relative grid grid-cols-3 grid-rows-3 gap-2 animate-hash">
				{[...Array(9)].map((_, index) => (
					<div
						key={index}
						className={`w-4 h-4 rounded-full ${
							index % 2 === 0 ? "bg-emerald-500" : "bg-emerald-200"
						}`}
					></div>
				))}
			</div>

			<style jsx>{`
				@keyframes hashSpin {
					0%, 100% {
						transform: scale(1);
						opacity: 1;
					}
					50% {
						transform: scale(0.5);
						opacity: 0.6;
					}
				}

				.animate-hash > div {
					animation: hashSpin 1.2s infinite ease-in-out;
				}

				.animate-hash > div:nth-child(1) {
					animation-delay: -1.1s;
				}
				.animate-hash > div:nth-child(2) {
					animation-delay: -1s;
				}
				.animate-hash > div:nth-child(3) {
					animation-delay: -0.9s;
				}
				.animate-hash > div:nth-child(4) {
					animation-delay: -0.8s;
				}
				.animate-hash > div:nth-child(5) {
					animation-delay: -0.7s;
				}
				.animate-hash > div:nth-child(6) {
					animation-delay: -0.6s;
				}
				.animate-hash > div:nth-child(7) {
					animation-delay: -0.5s;
				}
				.animate-hash > div:nth-child(8) {
					animation-delay: -0.4s;
				}
				.animate-hash > div:nth-child(9) {
					animation-delay: -0.3s;
				}
			`}</style>
		</div>
	);
};

export default LoadingSpinner;
