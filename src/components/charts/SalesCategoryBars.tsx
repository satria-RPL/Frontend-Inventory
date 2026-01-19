type Category = {
  label: string;
  width: string;
};

const categories: Category[] = [
  { label: "Makanan", width: "w-3/4" },
  { label: "Minuman", width: "w-full" },
  { label: "Add Ons", width: "w-1/3" },
  { label: "Lainnya", width: "w-1/4" },
];

export default function SalesCategoryBars() {
  return (
    <div className="mt-4 space-y-3 text-sm">
      {categories.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{item.label}</span>
          </div>

          <div className="mt-1 h-2 rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full bg-orange-500 ${item.width}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
