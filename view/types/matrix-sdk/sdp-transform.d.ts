/**
 * Enhanced type definitions for the 'sdp-transform' library
 *
 * This file is necessary because:
 * - The existing @types/sdp-transform package has incomplete type definitions
 * - matrix-js-sdk's WebRTC code was causing TS7006 errors (implicit 'any' types)
 * - The original types marked 'rtp' and 'fmtp' as optional, but matrix-js-sdk assumes they exist
 * - Without proper MediaDescription.ssrcs typing, forEach operations on ssrc arrays failed
 * - This provides complete, accurate types matching how the SDK actually uses the library
 * - Resolves all remaining TypeScript errors in the matrix-js-sdk WebRTC functionality
 */

declare module 'sdp-transform' {
  export interface MediaDescription {
    type: string;
    port: number;
    protocol: string;
    payloads?: string;
    connection?: ConnectionData;
    bandwidth?: BandwidthData[];
    attributes?: AttributeData[];
    ssrcs?: SsrcData[];
    ssrcGroups?: SsrcGroupData[];
    candidates?: CandidateData[];
    ext?: ExtData[];
    rtp: RtpData[];
    fmtp: FmtpData[];
    rtcp?: RtcpData[];
    rtcpFb?: RtcpFbData[];
    [key: string]: unknown;
  }

  export interface SsrcData {
    id: number;
    attribute: string;
    value?: string;
  }

  export interface SsrcGroupData {
    semantics: string;
    ssrcs: string;
  }

  export interface SessionDescription {
    version: number;
    origin: OriginData;
    name: string;
    description?: string;
    uri?: string;
    email?: string;
    phone?: string;
    timing: TimingData;
    connection?: ConnectionData;
    bandwidth?: BandwidthData[];
    attributes?: AttributeData[];
    media: MediaDescription[];
    [key: string]: unknown;
  }

  export interface OriginData {
    username: string;
    sessionId: string;
    sessionVersion: number;
    netType: string;
    ipVer: number;
    address: string;
  }

  export interface TimingData {
    start: number;
    stop: number;
  }

  export interface ConnectionData {
    version: number;
    ip: string;
  }

  export interface BandwidthData {
    type: string;
    limit: number;
  }

  export interface AttributeData {
    key: string;
    value?: string;
  }

  export interface CandidateData {
    foundation: string;
    component: number;
    transport: string;
    priority: number;
    ip: string;
    port: number;
    type: string;
    generation?: number;
  }

  export interface ExtData {
    value: number;
    direction?: string;
    uri: string;
    config?: string;
  }

  export interface RtpData {
    payload: number;
    codec: string;
    rate: number;
    encoding?: number;
  }

  export interface FmtpData {
    payload: number;
    config: string;
  }

  export interface RtcpData {
    port: number;
    netType?: string;
    ipVer?: number;
    address?: string;
  }

  export interface RtcpFbData {
    payload: number;
    type: string;
    subtype?: string;
  }

  export function parse(sdp: string): SessionDescription;
  export function write(description: SessionDescription): string;
}
