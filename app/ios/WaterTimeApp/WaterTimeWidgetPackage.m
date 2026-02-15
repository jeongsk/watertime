#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WaterTimeWidgetModule, NSObject)

RCT_EXTERN_METHOD(updateWidget:(NSInteger)totalAmount
                        goal:(NSInteger)goal
                     resolver:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearWidgetData:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject)

@end
