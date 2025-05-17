import AnimationWrapper from "../common/page-animation.jsx";
import InPageNavigation from "../components/inpage-navigation.component.jsx";

const HomePage = () => {
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/*latest Blogs -> Left Side*/}
                <div className= "w-full">
                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
                        <h1>Latest Blogs</h1>
                        <h1>Trending Blogs</h1>
                    </InPageNavigation>
                </div>
                {/*Filters & Trending  -> Right Side*/}
                <div></div>
            </section>
        </AnimationWrapper>
    )
}
export default HomePage;