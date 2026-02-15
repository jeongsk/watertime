import { NativeModule, NativeModules } from 'react-native';

interface WaterTimeWidgetInterface extends NativeModule {
  updateWidget(totalAmount: number, goal: number): Promise<void>;
  clearWidgetData(): Promise<void>;
}

const WaterTimeWidgetModule = NativeModules.WaterTimeWidgetModule as WaterTimeWidgetInterface | null;

export default WaterTimeWidgetModule;
