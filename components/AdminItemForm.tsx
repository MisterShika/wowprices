"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
};

type ExistingItem = {
  id: number;
  name: string;
  icon: string;
  rarity: string | null;
};

type Props = {
  categories: Category[];
  items: ExistingItem[];
  icons: string[];
};

type ComponentEntry = {
  itemId: number;
  quantity: number;
};

const rarities = [
  "Poor",
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Artifact",
  "Heirloom",
];

function getIconUrl(filename: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/items-icons/${filename}`;
}

function copperFromPrice(
  gold: string,
  silver: string,
  copper: string
) {
  return (
    (Number(gold) || 0) * 10000 +
    (Number(silver) || 0) * 100 +
    (Number(copper) || 0)
  );
}

export default function AdminItemForm({
  categories,
  items,
  icons,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [rarity, setRarity] = useState("Common");

  const [vendorGold, setVendorGold] = useState("");
  const [vendorSilver, setVendorSilver] = useState("");
  const [vendorCopper, setVendorCopper] = useState("");

  const [purchaseGold, setPurchaseGold] = useState("");
  const [purchaseSilver, setPurchaseSilver] = useState("");
  const [purchaseCopper, setPurchaseCopper] = useState("");

  const [crafted, setCrafted] = useState(false);

  const [components, setComponents] = useState<ComponentEntry[]>([]);

  const [componentSearch, setComponentSearch] = useState("");

  const [selectedIcon, setSelectedIcon] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredComponents =
    componentSearch.trim().length > 0
      ? items
          .filter((item) =>
            item.name
              .toLowerCase()
              .includes(componentSearch.toLowerCase())
          )
          .filter(
            (item) =>
              !components.some(
                (component) => component.itemId === item.id
              )
          )
          .slice(0, 10)
      : [];

  function addComponent(itemId: number) {
    setComponents((current) => [
      ...current,
      {
        itemId,
        quantity: 1,
      },
    ]);

    setComponentSearch("");
  }

  function removeComponent(itemId: number) {
    setComponents((current) =>
      current.filter((component) => component.itemId !== itemId)
    );
  }

  function updateQuantity(itemId: number, quantity: number) {
    setComponents((current) =>
      current.map((component) =>
        component.itemId === itemId
          ? {
              ...component,
              quantity: Math.max(1, quantity),
            }
          : component
      )
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter an item name.");
      return;
    }

    if (!categoryId) {
      setError("Please select an item category.");
      return;
    }

    if (!selectedIcon) {
      setError("Please select an icon.");
      return;
    }

    if (crafted && components.length === 0) {
      setError(
        "A crafted item must have at least one component."
      );
      return;
    }

    setSaving(true);

    const baseSalePrice = copperFromPrice(
      vendorGold,
      vendorSilver,
      vendorCopper
    );

    const purchasePrice =
      purchaseGold ||
      purchaseSilver ||
      purchaseCopper
        ? copperFromPrice(
            purchaseGold,
            purchaseSilver,
            purchaseCopper
          )
        : null;

    // Remove .jpg from the value stored in items.icon
    const iconName = selectedIcon.replace(/\.jpg$/i, "");

    // Create the item
    const { data: newItem, error: itemError } =
      await supabase
        .from("items")
        .insert({
          name: name.trim(),
          category_id: Number(categoryId),
          rarity,
          base_sale_price: baseSalePrice,
          purchase_price: purchasePrice,
          icon: iconName,
        })
        .select("id")
        .single();

    if (itemError || !newItem) {
      setSaving(false);
      setError(
        itemError?.message ?? "Failed to create item."
      );
      return;
    }

    // Create component relationships
    if (crafted && components.length > 0) {
      const componentRows = components.map((component) => ({
        item_id: newItem.id,
        component_id: component.itemId,
        quantity: component.quantity,
      }));

      const { error: componentError } = await supabase
        .from("item_components")
        .insert(componentRows);

      if (componentError) {
        // The item was created, but its components weren't.
        setSaving(false);
        setError(
          `Item created, but components could not be added: ${componentError.message}`
        );
        return;
      }
    }

    setSaving(false);

    router.push(`/item/${newItem.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-mist-800 text-white rounded-md p-6 space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block font-semibold mb-2">
          Item Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          placeholder="Healing Potion"
        />
      </div>

      {/* Category + rarity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">
            Item Type
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          >
            <option value="">
              Select item type
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Rarity
          </label>

          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          >
            {rarities.map((rarityOption) => (
              <option
                key={rarityOption}
                value={rarityOption}
              >
                {rarityOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor sale price */}
      <div>
        <label className="block font-semibold mb-2">
          Vendor Sale Price
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Gold"
            value={vendorGold}
            onChange={(e) =>
              setVendorGold(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          />

          <input
            type="number"
            min="0"
            placeholder="Silver"
            value={vendorSilver}
            onChange={(e) =>
              setVendorSilver(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          />

          <input
            type="number"
            min="0"
            placeholder="Copper"
            value={vendorCopper}
            onChange={(e) =>
              setVendorCopper(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Vendor purchase price */}
      <div>
        <label className="block font-semibold mb-2">
          Vendor Purchase Price
          <span className="text-gray-400 font-normal ml-2">
            Optional
          </span>
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Gold"
            value={purchaseGold}
            onChange={(e) =>
              setPurchaseGold(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          />

          <input
            type="number"
            min="0"
            placeholder="Silver"
            value={purchaseSilver}
            onChange={(e) =>
              setPurchaseSilver(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          />

          <input
            type="number"
            min="0"
            placeholder="Copper"
            value={purchaseCopper}
            onChange={(e) =>
              setPurchaseCopper(e.target.value)
            }
            className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Crafted */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={crafted}
            onChange={(e) =>
              setCrafted(e.target.checked)
            }
            className="w-5 h-5"
          />

          <span className="font-semibold">
            This item is crafted
          </span>
        </label>
      </div>

      {/* Components */}
      {crafted && (
        <div className="border border-gray-600 rounded-md p-4">
          <h2 className="text-xl font-bold mb-4">
            Components
          </h2>

          <div className="relative">
            <input
              type="text"
              value={componentSearch}
              onChange={(e) =>
                setComponentSearch(e.target.value)
              }
              placeholder="Search for a component..."
              className="w-full bg-white text-gray-800 px-3 py-2 rounded-md"
            />

            {filteredComponents.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white text-gray-800 rounded-md shadow-lg z-20 overflow-hidden">
                {filteredComponents.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addComponent(item.id)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    <img
                      src={getIconUrl(
                        `${item.icon}.jpg`
                      )}
                      alt=""
                      className="w-8 h-8 rounded"
                    />

                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {components.length > 0 && (
            <div className="mt-4 space-y-2">
              {components.map((component) => {
                const item = items.find(
                  (item) =>
                    item.id === component.itemId
                );

                if (!item) {
                  return null;
                }

                return (
                  <div
                    key={component.itemId}
                    className="flex items-center gap-3 bg-mist-700 p-3 rounded-md"
                  >
                    <img
                      src={getIconUrl(
                        `${item.icon}.jpg`
                      )}
                      alt=""
                      className="w-10 h-10 rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">
                        {item.name}
                      </p>
                    </div>

                    <input
                      type="number"
                      min="1"
                      value={component.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          component.itemId,
                          Number(e.target.value)
                        )
                      }
                      className="w-20 bg-white text-gray-800 px-2 py-1 rounded-md"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeComponent(
                          component.itemId
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Icon */}
      <div>
        <label className="block font-semibold mb-2">
          Icon
        </label>

        {selectedIcon && (
          <div className="mb-4 flex items-center gap-3">
            <img
              src={getIconUrl(selectedIcon)}
              alt=""
              className="w-16 h-16 rounded"
            />

            <span className="text-gray-300">
              {selectedIcon}
            </span>
          </div>
        )}

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-80 overflow-y-auto p-2 bg-mist-700 rounded-md">
          {icons.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() =>
                setSelectedIcon(icon)
              }
              className={`p-1 rounded ${
                selectedIcon === icon
                  ? "ring-2 ring-yellow-400"
                  : "hover:ring-2 hover:ring-gray-400"
              }`}
              title={icon}
            >
              <img
                src={getIconUrl(icon)}
                alt={icon}
                className="w-full aspect-square rounded"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black font-bold py-3 rounded-md"
      >
        {saving ? "Creating Item..." : "Create Item"}
      </button>
    </form>
  );
}