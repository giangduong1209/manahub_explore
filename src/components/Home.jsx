import MainBanner from "./MainBanner/MainBanner";
import CategoryList from "./CategoryList/CategoryList";
import NotableSlider from "./NotableSlider";
import AutoSlide from "./AutoSlide";
import ExploreSlide from './ExploreSlide';

export default function Home() {
  return (
    <div>
      <MainBanner />
      <NotableSlider />
      <ExploreSlide />
      <CategoryList />
      <AutoSlide />
    </div>
  );
}
