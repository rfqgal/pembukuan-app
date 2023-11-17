import {
  useState, createContext, useContext, Fragment, useMemo,
} from 'react';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const DropdownContext = createContext();

function Dropdown({ children }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };

  const dropdownProviderValue = useMemo(
    () => ({ open, setOpen, toggleOpen }),
    [open, setOpen, toggleOpen],
  );

  return (
    <DropdownContext.Provider value={dropdownProviderValue}>
      <div className="relative">{children}</div>
    </DropdownContext.Provider>
  );
}

function Trigger({ children }) {
  const { open, setOpen, toggleOpen } = useContext(DropdownContext);

  return (
    <>
      <button type="button" className="flex" onClick={toggleOpen}>
        {children}
      </button>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-label="Close"
        />
      )}
    </>
  );
}

function Content({
  align = 'right',
  width = '48',
  contentClasses = 'py-1 bg-white',
  children,
}) {
  const { open, setOpen } = useContext(DropdownContext);

  let alignmentClasses = 'origin-top';

  if (align === 'left') {
    alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
  } else if (align === 'right') {
    alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
  }

  let widthClasses = '';

  if (width === '48') {
    widthClasses = 'w-48';
  }

  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <button
        type="button"
        className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
        onClick={() => setOpen(false)}
      >
        <div
          className={
              `rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`
            }
        >
          {children}
        </div>
      </button>
    </Transition>
  );
}

function DropdownLink({ className = '', children, ...props }) {
  return (
    <Link
      {...props}
      className={
        `block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ${
          className}`
      }
    >
      {children}
    </Link>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
