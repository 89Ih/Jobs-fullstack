interface Iprops {
  cards: number;
}
const CardSkeleton = ({ cards }: Iprops) => {
  return (
    <>
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            role="status"
            className="max-w-sm animate-pulse min-w-full bg-slate-100 h-16 flex items-center"
          >
            <div className="ml-3 h-6 dark:bg-slate-200 w-1/3"></div>
          </div>
        ))}
    </>
  );
};
export default CardSkeleton;
