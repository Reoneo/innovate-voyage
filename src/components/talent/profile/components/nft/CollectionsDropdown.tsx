
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronDown, Search, Grid3X3 } from 'lucide-react';

interface CollectionsDropdownProps {
  collections: any[];
  selectedCollection: string | null;
  onCollectionSelect: (collectionName: string | null) => void;
}

const CollectionsDropdown: React.FC<CollectionsDropdownProps> = ({
  collections,
  selectedCollection,
  onCollectionSelect
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const displayText = selectedCollection || 'All Collections';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="justify-between min-w-[180px] bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <div className="flex items-center gap-2">
            <Grid3X3 size={16} />
            <span className="truncate">{displayText}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg" align="start">
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search collections..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onCollectionSelect(null);
                  setOpen(false);
                  setSearchValue('');
                }}
                className="cursor-pointer"
              >
                <Grid3X3 className="mr-2 h-4 w-4" />
                All Collections
              </CommandItem>
              {filteredCollections.map((collection) => (
                <CommandItem
                  key={collection.name}
                  value={collection.name}
                  onSelect={() => {
                    onCollectionSelect(collection.name);
                    setOpen(false);
                    setSearchValue('');
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
                    <span className="truncate">{collection.name}</span>
                    <span className="text-xs text-gray-500">({collection.nfts.length})</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {filteredCollections.length === 0 && searchValue && (
              <CommandEmpty>No collections found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionsDropdown;
