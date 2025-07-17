import { FaUtensils } from "react-icons/fa";

function SectionHeader({ title, icon: Icon = FaUtensils }) {
  return (
    <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2 mb-4">
      <Icon className="text-red-400" />
      {title}
    </h3>
  );
}

export default SectionHeader;
