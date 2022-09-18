import { MbButton } from 'mintbase-ui';
import Image from 'next/image';
import { StoreNfts } from '../types/types';
import { parseMedia } from '../utils';

function Item({
  item,
  showModal,
}: {
  item: StoreNfts
  showModal: (item: StoreNfts) => void
}): JSX.Element {
  const { mediaUrl } = parseMedia(item.media, item.base_uri);

  return (
    <div className="bg-white rounded shadow-lg p-4 relative">
      <div className="w-full h-72 mb-10 relative object-cover">
        {mediaUrl ? (
          <Image
            src={mediaUrl}
            alt={item.title}
            layout="fill"
          />
        ) : null }
      </div>
      <div className="">
        <div className="text-xl text-gray-800 font-bold">{item.title}</div>
        <div className="text-sm">{item.storeId}</div>
      </div>
      <div className="flex items-center mt-2 justify-center">
        <MbButton onClick={() => showModal(item)} label="DONATE" />
      </div>
    </div>
  );
}

function LoadingItem(): JSX.Element {
  const products = Array.from(Array(12).keys());

  return (
    <>
      {products.map((productKey) => (
        <div key={productKey} className="flex items-center justify-center ">
          <div className="w-full h-64 bg-slate-900 animate-pulse" />
        </div>
      ))}
    </>
  );
}

export { Item, LoadingItem };
