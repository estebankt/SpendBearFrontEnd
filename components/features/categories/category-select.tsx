'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCategories } from '@/lib/hooks/use-categories';

export interface CategorySelectProps {
  value?: string;
  onChange?: (categoryId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Category Select Component
 *
 * Features:
 * - Dropdown with category list
 * - Search/filter functionality
 * - Shows system vs user categories differently
 * - Loading state
 */
export function CategorySelect({
  value,
  onChange,
  placeholder = 'Select category...',
  disabled = false,
  className,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const { data: categories, isLoading } = useCategories();

  const selectedCategory = categories?.find((cat) => cat.id === value);

  // Separate system and user categories
  const systemCategories = categories?.filter((cat) => cat.isSystemCategory) ?? [];
  const userCategories = categories?.filter((cat) => !cat.isSystemCategory) ?? [];

  const handleSelect = (categoryId: string) => {
    onChange?.(categoryId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled || isLoading}
        >
          {selectedCategory ? (
            <span className="flex items-center gap-2">
              {selectedCategory.isSystemCategory && (
                <span className="text-xs text-muted-foreground">🏷️</span>
              )}
              {selectedCategory.name}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading categories...' : 'No category found.'}
            </CommandEmpty>

            {/* System Categories */}
            {systemCategories.length > 0 && (
              <CommandGroup heading="Default Categories">
                {systemCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleSelect(category.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === category.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-xs">🏷️</span>
                      {category.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* User Categories */}
            {userCategories.length > 0 && (
              <CommandGroup heading="My Categories">
                {userCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleSelect(category.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === category.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
