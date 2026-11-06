import {Composition,registerRoot} from 'remotion';
import {TestScene} from './TestScene';
import {ExpressiveScene} from './workshop/ExpressiveScene';
import {CinematicScene} from './workshop/CinematicScene';
import {WorkshopScene} from './workshop/WorkshopScene';
registerRoot(() => <><Composition id="GardenTestFrame" component={TestScene} durationInFrames={1} fps={30} width={360} height={640}/><Composition id="ClockWorkshop" component={WorkshopScene} durationInFrames={1} fps={30} width={360} height={640}/><Composition id="ClockmakerV3" component={CinematicScene} durationInFrames={300} fps={30} width={360} height={640}/><Composition id="ClockmakerV4" component={ExpressiveScene} durationInFrames={150} fps={30} width={360} height={640}/></>);
