import { ReactNode } from 'react';
import { Disclosure } from '@headlessui/react';
import AccordionCSS from './Accordion.module.css';

type Props = {
  title: string;
  children: ReactNode;
};

const Accordion = ({ title, children }: Props) => {
  return (
    <Disclosure as="div" className={AccordionCSS.container}>
      <Disclosure.Button className={AccordionCSS.header}>
        <h2>{title}</h2>
        <div className="x-btn"></div>
      </Disclosure.Button>
      <Disclosure.Panel unmount={false} className={AccordionCSS.content}>
        <div>{children}</div>
      </Disclosure.Panel>
    </Disclosure>
  );
};

export default Accordion;
