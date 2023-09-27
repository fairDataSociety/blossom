import React from 'react'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const Wrapper = styled('div')(({ theme }) => ({
  width: '600px',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  padding: '0 50px 50px 50px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '0',
  },
}))

const PrivacyPolicy = () => {
  return (
    <Wrapper>
      <Typography variant="h5" sx={{ margin: '30px 0 10px 0' }}>
        Blossom Extension Privacy Policy
      </Typography>
      <Typography variant="body1">
        The Blossom Extension is owned by the Swarm Association ("We"). We do not track or collect any of your
        Personal Data, nor do we sell it to anyone else or use it for advertising.
      </Typography>
      <Typography variant="body1">
        By installing Blossom Extension, you accept this privacy policy.
      </Typography>
      <Typography variant="h6" sx={{ margin: '30px 0 10px 0' }}>
        What Does This Privacy Policy Cover?
      </Typography>
      <Typography variant="body1">
        This Privacy Policy explains that we don’t gather, track, nor permanently store any of your Personal
        Data. It also covers Additional Privacy Protocols related to the way the Blossom Extension allows
        people to add and retrieve data to and from the Swarm Network (which is a peer-to-peer network). This
        Privacy Policy doesn’t apply to projects run by other organizations outside Swarm Association, even if
        we promote the use of those projects or happen to contribute to them.
      </Typography>
      <Typography variant="h6" sx={{ margin: '30px 0 10px 0' }}>
        What Information Is Collected?
      </Typography>
      <Typography variant="body1">We do not collect any data about you, including personal data.</Typography>
      <Typography variant="h6" sx={{ margin: '30px 0 10px 0' }}>
        Explicitly Shared Data Will Be Publicly Available Over The Swarm Network
      </Typography>
      <Typography variant="body1">
        We do not collect, rent, store or sell your Personal Data to anyone. However because Blossom Extension
        is a web extension that provides access to the real-time, peer-to-peer Swarm Network (which is a
        public platform for which anyone may join and participate) the data that you import to the Swarm
        Network using Blossom Extension is then publicly available and accessible to everyone participating in
        Swarm Network.
      </Typography>
      <Typography variant="h6" sx={{ margin: '30px 0 10px 0' }}>
        Additional Privacy Protocols
      </Typography>
      <Typography variant="body1">
        If you add files to the Swarm Network using the Blossom Extension, they will be split into pieces and
        stored across nodes on the network. Those files are also then cached by anyone who retrieves those
        files from the Swarm network and co-hosted on that user’s local Swarm Network node. Generally, cached
        files will eventually expire, but it’s possible for a user with whom you have shared access to such
        files (by sharing the relevant Content Identifier) to pin that data, which means the cached files then
        will not expire and will remain stored on such user’s local Swarm Network node.
      </Typography>
      <Typography variant="body1">
        All content shared with the Swarm Network is public by default. This means your files and data that
        you’ve added will be accessible to everyone who knows the Content Identifier or queries the data on
        the Swarm Network. If you want to share certain materials or data privately, you must encrypt such
        data before adding it to the Swarm Network.
      </Typography>
      <Typography variant="body1">
        Websites will be able to detect you are running Blossom Extension. To disable this behavior use
        incognito mode or turn off the extension.
      </Typography>
      <Typography variant="h6" sx={{ margin: '30px 0 10px 0' }}>
        Will The Privacy Policy Be Changed?
      </Typography>
      <Typography variant="body1">
        We’re constantly trying to improve Blossom Extension, so we may need to change this Privacy Policy
        sometimes. When we do, we will update it on our{' '}
        <a href="https://github.com/fairDataSociety/blossom/commits/main/PRIVACY-POLICY.md" target="_blank">
          Github page
        </a>{' '}
        where you will be able to track changes. We encourage you to periodically review this Privacy Policy
        to stay informed, which is ultimately your responsibility. If you use Blossom Extension after any
        changes to the Privacy Policy have been posted, that means you agree to all of those changes.
      </Typography>
      <Typography variant="h6" sx={{ margin: '30px 0 10px 0' }}>
        Where Can I Raise My Questions?
      </Typography>
      <Typography variant="body1">
        If you have any questions or concerns regarding the Privacy Policy, please send a message at
        info@ethswarm.org.
      </Typography>
    </Wrapper>
  )
}

export default PrivacyPolicy
