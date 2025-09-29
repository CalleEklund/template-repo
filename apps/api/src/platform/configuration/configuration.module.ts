import { ConfigurationService } from "./configuration.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
