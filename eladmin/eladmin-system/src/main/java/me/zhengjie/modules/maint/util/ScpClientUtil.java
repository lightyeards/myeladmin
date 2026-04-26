/*
 *  Copyright 2019-2025 Zheng Jie
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package me.zhengjie.modules.maint.util;

import com.google.common.collect.Maps;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import me.zhengjie.utils.StringUtils;

import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * 远程执行linux命令（基于 JSch SFTP，原 ganymed-ssh2 已移除）
 * @author ZhangHouYing
 * @date 2019-08-10 10:06
 */
public class ScpClientUtil {

	private final String ip;
	private final int port;
	private final String username;
	private final String password;

	static private final Map<String,ScpClientUtil> instance = Maps.newHashMap();

	static synchronized public ScpClientUtil getInstance(String ip, int port, String username, String password) {
		instance.computeIfAbsent(ip, i -> new ScpClientUtil(i, port, username, password));
		return instance.get(ip);
	}

	public ScpClientUtil(String ip, int port, String username, String password) {
		this.ip = ip;
		this.port = port;
		this.username = username;
		this.password = password;
	}

	public void getFile(String remoteFile, String localTargetDirectory) {
		Session session = null;
		ChannelSftp sftp = null;
		try {
			session = createSession();
			sftp = (ChannelSftp) session.openChannel("sftp");
			sftp.connect();
			sftp.get(remoteFile, localTargetDirectory);
		} catch (JSchException | SftpException ex) {
			Logger.getLogger(ScpClientUtil.class.getName()).log(Level.SEVERE, null, ex);
		} finally {
			closeQuietly(sftp, session);
		}
	}

	public void putFile(String localFile, String remoteTargetDirectory) {
		putFile(localFile, null, remoteTargetDirectory);
	}

	public void putFile(String localFile, String remoteFileName, String remoteTargetDirectory) {
		putFile(localFile, remoteFileName, remoteTargetDirectory,null);
	}

	public void putFile(String localFile, String remoteFileName, String remoteTargetDirectory, String mode) {
		Session session = null;
		ChannelSftp sftp = null;
		try {
			session = createSession();
			sftp = (ChannelSftp) session.openChannel("sftp");
			sftp.connect();
			if (StringUtils.isBlank(mode)) {
				mode = "0600";
			}
			String remotePath;
			if (remoteFileName == null) {
				// 仿照原行为：未指定文件名时直接 put 到目录，使用本地文件名
				sftp.put(localFile, remoteTargetDirectory);
				String localName = localFile.replace('\\', '/');
				localName = localName.substring(localName.lastIndexOf('/') + 1);
				remotePath = remoteTargetDirectory.endsWith("/")
						? remoteTargetDirectory + localName
						: remoteTargetDirectory + "/" + localName;
			} else {
				remotePath = remoteTargetDirectory.endsWith("/")
						? remoteTargetDirectory + remoteFileName
						: remoteTargetDirectory + "/" + remoteFileName;
				sftp.put(localFile, remotePath);
			}
			// SFTP 没有 SCP 那种 put-with-mode，需要单独 chmod
			sftp.chmod(Integer.parseInt(mode, 8), remotePath);
		} catch (JSchException | SftpException ex) {
			Logger.getLogger(ScpClientUtil.class.getName()).log(Level.SEVERE, null, ex);
		} finally {
			closeQuietly(sftp, session);
		}
	}

	private Session createSession() throws JSchException {
		JSch jsch = new JSch();
		Session session = jsch.getSession(username, ip, port);
		session.setPassword(password);
		Properties config = new Properties();
		config.put("StrictHostKeyChecking", "no");
		session.setConfig(config);
		session.connect();
		return session;
	}

	private void closeQuietly(ChannelSftp sftp, Session session) {
		if (sftp != null && sftp.isConnected()) {
			sftp.disconnect();
		}
		if (session != null && session.isConnected()) {
			session.disconnect();
		}
	}
}
