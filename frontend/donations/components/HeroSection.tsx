import { MbText } from 'mintbase-ui';

function HeroSection(): JSX.Element {
  return (
    <div className="bg-white flex flex-1 flex-col items-center justify-center">
      <div className="items-center justify-center">
        <MbText className="text-3xl p-4 text-black">
          round up for change
        </MbText>
      </div>
    </div>
  );
}

export default HeroSection;
