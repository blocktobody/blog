import { NextPage } from 'next';
import fs from 'fs';
import matter from 'gray-matter';

import Layout from '@components/layout';
import PostCard from '@components/cards/PostCard';
import { getPath } from '@utils/getPath';
import { getSlug } from '@utils/getSlug';
import { Post } from '@constants/types';
import PageMeta from '@components/layout/PageMeta';
import styled from '@emotion/styled';

interface Props {
  posts: Post[];
}

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <PageMeta path="blog" />
      <PostCardList>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </PostCardList>
    </Layout>
  );
};

export default Blog;

export async function getStaticProps() {
  const files = fs.readdirSync(getPath('posts'));

  const posts = files
    .map((filename) => {
      const mdxWithMeta = fs.readFileSync(getPath('posts', filename), 'utf-8');
      const { data: frontMatter } = matter(mdxWithMeta);

      return {
        frontMatter,
        slug: getSlug(filename),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontMatter?.publishedAt).valueOf() -
        new Date(a.frontMatter?.publishedAt).valueOf(),
    );

  return {
    props: {
      posts,
    },
  };
}

const PostCardList = styled.ul``;
