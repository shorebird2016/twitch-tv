angular.module('myApp', [])
    .controller('myCtrl', ['$http', function ($http) {
        var vm = this;

        //search 25 channels based on keyword
        vm.getChannelList = function () {
            vm.liveStreams = []; vm.channels = [];
            $http( {
                method: 'GET',
                headers: { 'Accept': 'application/vnd.twitchtv.v5+json',
                           'Client-ID': TWITCH_CLIENT_ID },
                url: TWITCH_ENDPOINT_SEARCH + 'channels?query=' + vm.searchKeyword + '&limit=25'
            }).then(function (payload) {
                console.log(payload);
                vm.channels = payload.data.channels;
            }, function (err) {
                console.log(err);
            });
        };
        vm.getVideoBannerUrl = function (index) {
            var banner_url = vm.channels[index].video_banner;
            if (banner_url === null)
                return "image/empty-bkgnd.png";
            else
                return banner_url;
        };
        vm.getLogoUrl = function (index) {
            var logo_url = vm.channels[index].logo;
            if (logo_url === null)
                return "image/channel-offline.png";//"http://placehold.it/300x300";
            else
                return logo_url;
        };
        vm.getProfileBanner = function (index) {
            var profile_banner_url = vm.channels[index].profile_banner;
            if (profile_banner_url === null)
                return "http://placehold.it/200x100";
            else
                return profile_banner_url;
        };
        //--make request to get channel details by id
        vm.getChannelInfo = function (index) {
            var channel_id = vm.channels[index]._id;
            $http( {
                method: 'GET',
                headers: { 'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': TWITCH_CLIENT_ID },
                url: TWITCH_ENDPOINT_CHANNELS + channel_id
            }).then(function (payload) {
                console.log(payload);
                vm.curChannel = payload.data;
            }, function (err) {
                console.log(err);
            });
        };
        //--obtain live streams (on-air channels)
        vm.getLiveStreams = function () {
            vm.liveStreams = []; vm.channels = [];//clear view
            $http( {
                method: 'GET',
                headers: { 'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': TWITCH_CLIENT_ID },
                url: TWITCH_ENDPOINT_LIVE_STREAMS
            }).then(function (payload) {
                console.log(payload);
                vm.liveStreams = payload.data.streams;
                //copy live list to vm.channels (they have different structure) for display
                vm.liveStreams.forEach(function (element) {
                    vm.channels.push(element.channel);
                });
                console.log("done");
            }, function (err) {
                console.log(err);
            });
        };
    }]);

const TWITCH_CLIENT_ID = "rymre0n35hkn2bs6me2go85c4uabhz"; //if this is wrong, will get "Bad Request" 400
const TWITCH_ENDPOINT_SEARCH = "https://api.twitch.tv/kraken/search/";
const TWITCH_ENDPOINT_CHANNELS = "https://api.twitch.tv/kraken/channels/";
const TWITCH_ENDPOINT_LIVE_STREAMS = "https://api.twitch.tv/kraken/streams/";
